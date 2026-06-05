import { AdminSidebar } from "./admin/AdminSidebar.js";
import { AdminDashboardSummary } from "./admin/AdminDashboardSummary.js";
import { AdminTodayRegistrations } from "./admin/AdminTodayRegistrations.js";
import { AdminDeleteModal } from "./admin/AdminDeleteModal.js";
import { AdminGuestMessages } from "./admin/AdminGuestMessages.js";
import { AdminGuestsTable } from "./admin/AdminGuestsTable.js";
import { AdminRegistrationControl } from "./admin/AdminRegistrationControl.js";

document.addEventListener("DOMContentLoaded", () => {
    const adminSidebar = new AdminSidebar();
    const adminDashboardSummary = new AdminDashboardSummary();
    const adminDeleteModal = new AdminDeleteModal();
    const adminTodayRegistrations = new AdminTodayRegistrations(adminDeleteModal);
    const adminGuestMessages = new AdminGuestMessages();
    const adminGuestsTable = new AdminGuestsTable(adminDeleteModal);
    const adminRegistrationControl = new AdminRegistrationControl();

    adminSidebar.init();
    adminDashboardSummary.init();
    adminDeleteModal.init();
    adminTodayRegistrations.init();
    adminGuestMessages.init();
    adminGuestsTable.init();
    adminRegistrationControl.init();

    document.addEventListener("admin:guest-deleted", async () => {
        await adminDashboardSummary.refresh();
        await adminTodayRegistrations.refresh();
        await adminGuestMessages.refresh();
        await adminGuestsTable.refresh();
    });
});