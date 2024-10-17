import PropTypes from 'prop-types'

export default function Error({errorMessage}) {
    return (
        <span className="text-red-600 text-center text-sm font-bold flex mx-auto items-center justify-center mt-3"> {errorMessage} </span>
    )
}

Error.propTypes = {
    errorMessage: PropTypes.string,
}