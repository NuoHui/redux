import compose from './compose'
import { Middleware, MiddlewareAPI } from './types/middleware'
import { AnyAction } from './types/actions'
import {
  StoreEnhancer,
  Dispatch,
  PreloadedState,
  StoreEnhancerStoreCreator
} from './types/store'
import { Reducer } from './types/reducers'

/**
 * 1. 创建store增强器，返回StoreEnhancer
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param middlewares The middleware chain to be applied.
 * @returns A store enhancer applying the middleware.
 *
 * @template Ext Dispatch signature added by a middleware.
 * @template S The type of the state supported by a middleware.
 */
export default function applyMiddleware(): StoreEnhancer
export default function applyMiddleware<Ext1, S>(
  middleware1: Middleware<Ext1, S, any>
): StoreEnhancer<{ dispatch: Ext1 }>
export default function applyMiddleware<Ext1, Ext2, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 }>
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, Ext5, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>,
  middleware5: Middleware<Ext5, S, any>
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 & Ext5 }>
export default function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  /**
   * createStore中的源码
   * return enhancer(createStore)(
      reducer,
      preloadedState as PreloadedState<S>
    ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
   */
  return (createStore: StoreEnhancerStoreCreator) => <S, A extends AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ) => {
    // 用传进来的reducer, preloadedState创建store
    const store = createStore(reducer, preloadedState)
    // 一个临时dispatch定义
    let dispatch: Dispatch = () => {
      // 改造之前被调用提示错误
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    // middleware约定的中间件签名 ({ getState, dispatch }) => next => action
    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    // 得到所有改造后的中间件函数
    // 类似所有中间件函数到了这一步 是这样一个函数：next => action
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // compose方法的作用是，例如这样调用：
    // compose(func1,func2,func3)
    // 返回一个函数: (...args) => func1( func2( func3(...args) ) )
    // 这里的store.dispatch 就是中间件签名的next
    dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

    // 覆盖store本身的dispatch方法
    return {
      ...store,
      dispatch
    }
  }
}

// function createThunkMiddleware(extraArgument) {

//   return function({ dispatch, getState }) { // 这是「中间件函数」
//       //参数是store中的dispatch和getState方法

//       return function(next) { // 这是「改造后的中间件函数」
//           //参数next是被当前中间件改造前的dispatch
//           //因为在被当前中间件改造之前，可能已经被其他中间件改造过了，所以不妨叫next

//           return function(action) { // 这是改造函数「改造后的dispatch方法」
//               if (typeof action === 'function') {
//                 //如果action是一个函数，就调用这个函数，并传入参数给函数使用
//                 return action(dispatch, getState, extraArgument);
//               }

//               //否则调用用改造前的dispatch方法
//               return next(action);
//           }
//       }
//   }
// }

// 一个异步action创建函数
// export function getMenusByRoleId(roleId: string) {
//   return (dispatch: Dispatch<AnyAction>) => {
//     return $http
//       .fetchMainMenu({ roleId })
//       .then(res => {
//         const { result } = res
//         dispatch(updateUserMenus(result && Array.isArray(result) ? result : []))
//       })
//       .catch(e => console.error(e))
//   }
// }
// dispatch(getMenusByRoleId('xxx'))
