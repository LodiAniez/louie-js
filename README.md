# louie-js
A miniature state management library written in javascript

# How to use
## 1st step
create your states, mutations and actions wherever you want.

`states` should be an object that contains a collection of properties that you can use to store data

`mutations` should be an object that contains a collection of pure functions, each functions will take 2 arguments, an `object` and the `payload` as an object, the object param
contains 1 key to be specific, keyname is `state`, state is the collection of states you've created as an object, you can access a state and pass the payload to it
in this mutation function (`Note: NEVER mutate the state to avoid memory leak`)

`actions` should be an object that contains a collection of functions, each function will take 2 arguments, an `object` that contains a commit key, and the payload
in a form of an object, `commit` key is a function that will take 2 arguments when called, first arg is the mutation function name as a string, second arg is the
payload.

`stateListener` should be a function, this will trigger everytime a state is updated

you can check the examples below.

### Example

```javascript
const states = {
  cart: [],
  orderCount: 0
}

const mutations = {
  addItem({ state }, payload) {
    const currentCart = [...state.cart]
    currentCart.push(payload)
    
    state.cart = currentCart
    state.orderCount = state.orderCount+1
  }
}

const actions = {
  addToCart({ commit }, payload) {
    /** You can add additional logic here before updating the state */
    commit("addItem", payload)
  }
}

const stateListener = (target, property) {
  /** Your logic here */
  const updateView = target[property]
}
```

## 2nd step
Create a `LouieJS` instance globally, passing the states, mutations and actions

### Example

```javascript
const louiejs = new LouieJS(states, mutations, actions, stateListener)
```

## Last step
Dispatch actions from your view controller to update a state (`Note: dispatch function can only call the functions defined in your actions object`), dispatch method
takes 2 argument, `action function name` as string, and the `payload` as an object

### Example

```typescript
interface CartItem {
  itemName: string,
  quantity: number
}

function addItemToCart(item: CartItem) {
  louiejs.dispatch("addToCart", item) /** Dispatch will take care of the rest */
}
```

you can watch for state update by adding logic inside your stateListener function

### Example

```typescript
const stateListener = (target, property) {
  /** Re-initialize variables by the new value of the state */
  const toUpdateView = target[property]
}
```

you can get the latest value of your state by accessing the `getState` method, that takes 1 argument, the statename as string

### Example

```typescript
const cart: Array<CartItem> = louiejs.getState("cart")
```

Currently, you can use a custom observable to watch state changes, this feature is currently in progress and will be available on the next release.
