import { Spinner } from "react-bootstrap"

const Loading = () => {
    return (
        <>
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="danger" />
            <Spinner animation="grow" variant="warning" />
        </>
    )
}

export default Loading