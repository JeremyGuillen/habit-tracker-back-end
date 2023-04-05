import { habitApi } from "../api/habit/habit-api";

export const createHabit = async (event) => {
    return habitApi.post(event);
}

export const updateHabit = async (event) => {
    return habitApi.put(event);
}

export const getHabit = async (event) => {
    return habitApi.get(event);
}

export const deleteHabit = async (event) => {
    return habitApi.delete(event);
}

export const filterHabit = async (event) => {
    return habitApi.filterItems(event);
}

export const listHabits = async (event) => {
    return habitApi.listHabits(event);
}

export const helloWorld = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hola mundo"})
    }
}
