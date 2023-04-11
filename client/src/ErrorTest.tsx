import { useLocation } from "react-router-dom"

const ErrorTest = () => {
  const location = useLocation()

  console.log("location", location);
  return (
    <div>ErrorTest</div>
  )
}

export default ErrorTest