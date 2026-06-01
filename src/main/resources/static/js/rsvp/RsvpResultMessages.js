export const RSVP_RESULT_MESSAGES = {
    ATTENDING: {
        stateClass: "is-attending",
        calendarClass: "is-confirmed",
        buttonClass: "is-confirmed",
        icon: "❤",
        label: "Confirmación recibida",
        title: "¡Gracias por acompañarnos!",
        paragraphs: [
            "Tu confirmación ha sido recibida correctamente.",
            "Nos emociona saber que formarás parte de este momento tan importante en nuestras vidas.",
            "Te esperamos con mucho cariño."
        ],
        date: "21 de Noviembre de 2026"
    },

    NOT_ATTENDING: {
        stateClass: "is-not-attending",
        calendarClass: "is-declined",
        buttonClass: "is-declined",
        icon: "❤",
        label: "Respuesta recibida",
        title: "Gracias por avisarnos",
        paragraphs: [
            "Aunque nos hubiera encantado compartir este día contigo, comprendemos que no siempre es posible asistir.",
            "Agradecemos mucho tu respuesta y te enviamos un afectuoso saludo."
        ],
        date: "21 de Noviembre de 2026"
    }
};