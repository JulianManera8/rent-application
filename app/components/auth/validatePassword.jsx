/* eslint-disable react/prop-types */
import { Progress } from "../ui/progress"
import { useState, useEffect } from "react"

export default function ValidatePassword({password}) {
    const [progressValue, setProgressValue] = useState(0)
    const [progressColor, setProgressColor] = useState("#de1b2e")
    const [itemValidated, setItemValidated] = useState({
      uppercase: false,
      lowercase: false,
      number: false,
      length: false,
    })
    
    useEffect(() => {
      
      const validations = {
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        length: password.length >= 8,
      }
  
      setItemValidated(validations)
  
      const validCount = Object.values(validations).filter(Boolean).length
      const newProgressValue = Math.min(validCount * 25, 100)
      setProgressValue(newProgressValue)
  
      const colorMap = {
        0: "#de1b2e",
        25: "#de8d1b",
        50: "#edc709",
        75: "#bced09",
        100: "#33ed09",
      }
      setProgressColor(colorMap[newProgressValue] || "#f72331")
    }, [password])
  

    return (
        <div className="mt-3">
          <Progress value={progressValue > 0 ? progressValue : 5} className="h-2" colorProgress={progressColor } />
          <ul className="list-inside mt-2 text-sm text-muted-foreground">
            <li className={itemValidated.uppercase ? 'line-through' : ''}>- Mayúscula</li>
            <li className={itemValidated.lowercase ? 'line-through' : ''}>- Minúscula</li>
            <li className={itemValidated.number ? 'line-through' : ''}>- Número</li>
            <li className={itemValidated.length ? 'line-through' : ''}>- 8 caracteres mínimo</li>
          </ul>
        </div>
    )
}

