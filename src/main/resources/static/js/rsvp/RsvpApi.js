export class RsvpApi {
    constructor() {
        this.endpoint = "/api/guests/confirm";
    }

    async submitRsvp(rsvpData) {
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rsvpData)
        });

        const data = await response.json();

        if(!response.ok)
            throw new Error(data.message || "No se pudo registrar la respuesta");

        return data;
    }
}