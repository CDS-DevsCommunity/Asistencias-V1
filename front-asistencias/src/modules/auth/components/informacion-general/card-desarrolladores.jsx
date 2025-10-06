import React from 'react'

const CardDesarrolladores = ({ cantidad, texto }) => {
    return (
        <article className="card-desarrolladores">
            <h3>+{cantidad}</h3>
            <p>{texto}</p>
        </article>
    )
}
export default CardDesarrolladores