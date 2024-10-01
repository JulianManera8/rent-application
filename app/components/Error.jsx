import PropTypes from 'prop-types'

export default function Error({errorMessage}) {
    return (
        <span className="text-red-600 text-center text-xl font-bold"> {errorMessage} </span>
    )
}

Error.propTypes = {
    errorMessage: PropTypes.string,
}