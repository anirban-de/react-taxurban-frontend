import { Tooltip } from "flowbite-react"
import { LoaderDark } from "../../assets"

const ActionBtn = ({ children, tooltip = "this is a tooltip", loading = false, ...rest }) => {
    return (
        <Tooltip content={tooltip} >
            {loading && <img src={LoaderDark} className="w-5 h-5" />}
            {!loading && <button {...rest} className="bg-green-400 hover:bg-green-500 p-1 rounded-md cursor-pointer">
                {children}
            </button>}
        </Tooltip>
    )
}

export default ActionBtn