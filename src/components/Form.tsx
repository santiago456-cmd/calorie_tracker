import categories from "../data/categories"
import { v4 as uuidv4 } from "uuid"
import { Dispatch, useState, useEffect } from "react"
import type { Activity } from "../types"
import { ActivityActions } from "../reducers/activityReducer"
import { ActivityState } from "../reducers/activityReducer"


type FormProps = {
  dispatch: Dispatch<ActivityActions>,
  state: ActivityState
}

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0
}

export default function Form({dispatch, state}: FormProps) {

  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect(() => {
    if (state.activeId){
      const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId )[0]
      setActivity(selectedActivity)
    }
  }, [state.activeId])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    
    const isNumberField = ['category', 'calories'].includes(e.target.id)

    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value
    })
  }

  const isValidActivity = () => {
    const {name, calories} = activity
    return name.trim() !== '' && calories > 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch({type:'save-activity', payload: {newActivity: activity}})

    setActivity({
      ...initialState,
      id: uuidv4()
    })
  }

  return(
    <form 
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}  
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">Categoria:</label>
        <select id="category" value={activity.category} onChange={handleChange}
                  className="border border-slate-300 p-2 rounded-lg w-full bg-white"
        >
          {categories.map(category => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name">Actividad</label>
        <input type="text" id="name" placeholder="Ej. Comida, Juego de Naranja, Ensalada, Ejercicio, Pesas, Bicicletas"
                  className="border border-slate-300 p-2 rounded-lg" value={activity.name}
                  onChange={handleChange}
        
        />

      </div>  
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories">Calorias</label>
        <input type="number" id="calories" placeholder="Ej. 300 o 500"
                  className="border border-slate-300 p-2 rounded-lg"
                  value={activity.calories} onChange={handleChange}
        
        />
        
      </div>
      <input type="submit" value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'} disabled={!isValidActivity()}
              className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
      />   
    </form>
  )
}
