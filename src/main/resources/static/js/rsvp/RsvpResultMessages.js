export const RSVP_RESULT_MESSAGES = {
    ATTENDING: {
        stateClass: "is-attending",
        calendarClass: "is-confirmed",
        buttonClass: "is-confirmed",

        icon: "✓",

        label: "Asistencia confirmada",

        title: "Nos vemos en nuestro gran día",

        paragraphs: [
            "Tu lugar ya forma parte de nuestra celebración."
        ],

        date: "21 · 11 · 2026"
    },

    NOT_ATTENDING: {
        stateClass: "is-not-attending",
        calendarClass: "is-declined",
        buttonClass: "is-declined",

        icon: "✦",

        label: "Respuesta recibida",

        title: "Gracias por hacérnoslo saber",

        paragraphs: [
            "Aunque esta vez no podamos coincidir, agradecemos mucho que hayas tomado un momento para responder."
        ],

        date: "Con cariño · Jairo & Jennifer"
    }
};