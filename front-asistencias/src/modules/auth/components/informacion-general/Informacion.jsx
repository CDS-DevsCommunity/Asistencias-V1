import React from 'react'
import CardDesarrolladores from './card-desarrolladores'
import './informacion.css'

const Informacion = () => {
    const cards = [
        {
            cantidad: 2.500,
            texto: 'Desarrolladores',
        }, {
            cantidad: 180,
            texto: 'proyectos activos',
        }, {
            cantidad: 50,
            texto: 'Eventos activos',
        }, {
            cantidad: 25,
            texto: 'Tecnologias',
        }
    ]
    return (
        <section className="informacion-general">
            <h4>BIENVENIDO A</h4>
            <h2>Comunidad de Desarrollo de Software</h2>
            <p>Únete a nuestra red de desarrolladores donde compartimos conocimiento, colaboramos en proyectos y crecemos  juntos profecionalmente. </p>
            <div className="contenedor-cards-desarrolladores">
                {
                    cards.map((card, index) => {
                        return <CardDesarrolladores key={index} cantidad={card.cantidad} texto={card.texto} />
                    })
                }
            </div>
        </section>
    )
}

export default Informacion