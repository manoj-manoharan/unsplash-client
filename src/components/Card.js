const Card = ({ style, children}) => {
    return (
        <li style={style} className="card">
            {children}
        </li>
    );
}

export default Card;