import {toast} from "react-toastify";

const notify = (string: String) => toast(string, {
    position: "top-center",
    autoClose: 3000,
    theme: "dark",
})

export default notify;