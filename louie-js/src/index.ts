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

	constructor (states: object, mutations: object, actions: object) {
		this.states = states
		this.mutations = mutations
		this.actions = actions
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
					 .call(this, { commit: (commitName: string, commitPayload: object) => this.commit(commitName, commitPayload) },  payload)
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
}