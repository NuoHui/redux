import { Dispatch } from './types/store'
import {
  AnyAction,
  ActionCreator,
  ActionCreatorsMapObject
} from './types/actions'

function bindActionCreator<A extends AnyAction = AnyAction>(
  // actionCreator： actor 创建函数
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  // 返回函数通过dispatch包装，可以直接调用
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
export default function bindActionCreators<A, C extends ActionCreator<A>>(
  actionCreator: C,
  dispatch: Dispatch
): C

export default function bindActionCreators<
  A extends ActionCreator<any>,
  B extends ActionCreator<any>
>(actionCreator: A, dispatch: Dispatch): B

export default function bindActionCreators<
  A,
  M extends ActionCreatorsMapObject<A>
>(actionCreators: M, dispatch: Dispatch): M
export default function bindActionCreators<
  M extends ActionCreatorsMapObject,
  N extends ActionCreatorsMapObject
>(actionCreators: M, dispatch: Dispatch): N

// 把一个 value 为不同 action creator 的对象，转成拥有同名 key 的对象。
// 同时使用 dispatch 对每个 action creator 进行包装，以便可以直接调用它们。
export default function bindActionCreators(
  // actionCreators： 一个 action creator，或者一个 value 是 action creator 的对象。
  actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
  dispatch: Dispatch
) {
  // 如果传入一个单独的函数作为 actionCreators，那么返回的结果也是一个单独的函数。
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  // 类型检查
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}
  // 遍历对象，挨个取出通过dispatch包装并存储
  for (const key in actionCreators) {
    // 取出action creator
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}


// 使用示例

// const mapStateToProps = (state: any) => ({
//   pageState: state.customerAcPageState
// })

// const mapDispatchToProps = (dispatch: Dispatch) =>
//   bindActionCreators(
//     {
//       customerAcPageState
//     },
//     dispatch
//   )
// export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomAct)

// this.props.customerAcPageState({})
