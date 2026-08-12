import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NoAccountPage = () => {
    return (
        <div className="flex h-screen items-center justify-center gap-5">
            <p>Please login, local storage is not yet supported.</p>
            <Button>
                <Link to='/login' >Login</Link>
            </Button>
            or create an account
            <Button>
                <Link to='/signup' >Register</Link>
            </Button>
        </div>
    )
}

export default NoAccountPage