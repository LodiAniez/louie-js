/**
 * 
 * @states are the values that should be accessible to all components,
 * state should not be mutable
 * 
 * @mutations are functions that updates the state
 * 
 * @actions allow us to write custom logic on how the state should get updated
 * we can call the mutation here using the `commit` method,
 * or call an action from a view controller using `dispatch` method
 */
class LouieJS {
	/**
	 * Properties should be private to avoid direct
	 * access during instantiation
	 */
	private states: object
	private mutations: object
	private actions: object
	private receiverfn: FunctionConstructor

	/**
	 * 
	 * @param states is an object, collection of states
	 * @param mutations is an object, collection of pure functions
	 * @param actions is an object, collection of functions
	 * @param receiverFn is a function, this will trigger every time there is an update in state
	 */
	constructor (states: object, mutations: object, actions: object, receiverFn: FunctionConstructor) {
		this.states = states

		this.mutations = mutations
		this.actions = actions
		this.receiverfn = receiverFn

		this.onStateChanges()
	}

	/**
	 * 
	 * @param {*} mutationName string (name of mutation function)
	 * @param {*} payload object (that will be assigned for the state)
	 * -----
	 * This function `should always be called from an action` and will always
	 * target a mutation function
	 */
	commit(mutationName: string = "", payload: object = {}) {
		try {
			if (typeof mutationName !== "string") throw new Error("Invalid argument type, mutation name should be of type string.")
			if (typeof payload !== "object") throw new Error("Invalid argument type, payload should be of type object.")
			if (typeof this.mutations !== "object") throw new Error("Mutations should be a collection of functions or methods.")

			const mutationKeys = Object.keys({ ...this.mutations })
			const mutationFn = mutationKeys.find(name => name === mutationName)

			if (mutationFn) {
				this.mutations[mutationName].call(this, { state: this.states }, payload)
			}
		} catch (err) {
			throw err
		}
	}

	/**
	 * 
	 * @param {*} actionName string (name of action function)
	 * @param {*} payload object (that will be passed to a mutation function, will be assigned to a specific state)
	 * -----
	 * This will be called from a view
	 */
	dispatch(actionName: string = "", payload: object = {}) {
		try {
			if (typeof actionName !== "string") throw new Error("Invalid argument type, action name should be of type string.")
			if (typeof payload !== "object") throw new Error("Invalid argument type, payload should be of type object.")
			if (typeof this.actions !== "object") throw new Error("Actions should be a collection of functions or methods.")

			const actionKeys = Object.keys({ ...this.actions })
			const actionFn = actionKeys.find(name => name === actionName)

			if (actionFn) {
				this.actions[actionName]
					 .call(
						 this, 
						 { 
							commit: (commitName: string, commitPayload: object) => this.commit(commitName, commitPayload)
						 }, 
						 payload
					 )
			}
		} catch (err) {
			throw err
		}
	}

	/**
	 * 
	 * @param {*} statename is the name of the state the user needs
	 * @returns the current value of the state
	 */
	getState(statename: string = ""): any {
		try {
			if (typeof statename !== "string") throw new Error("Invalid argument type, state name should be of type string.")

			const states = Object.keys({ ...this.states })
			const state = states.find(name => name === statename)

			if (!state) throw new Error("State not found from store.")

			return this.states[statename]
		} catch (err) {
			throw err
		}
	}

	/**
	 * 
	 * @param statename is optional, if null, it will send update to client for whatever changes occured on all states,
	 * if not null, it will send the update for this specific state
	 * @returns a subscribable function, as long as the client is subscibed, it will receive the state update
	 */
	onStateChanges() {
		const callReceiver = (thisIntance, target, property) => {
			if (this.receiverfn) {
				this.receiverfn.call(thisIntance, target, property)
			}
		}

		try {
			if (!this.isFunction(this.receiverfn)) throw new Error("Invalid argument type, a valid callback function must be provided as a parameter.")

			this.states = new Proxy(this.states, {
				set(target, property, value) {
					target[property] = value
					callReceiver(this, target, property)
					
					return true
				}
			})
		} catch (err) {
			throw err
		}
	}

	private isFunction(fn: any) {
		return (
			(typeof fn == "function") ||
			(fn instanceof Function) ||
			(Object.prototype.toString.call(fn) == '[object Function]') ||
			({}.toString.call(fn) == '[object Function]')
		)
	}
}