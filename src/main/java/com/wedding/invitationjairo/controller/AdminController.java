package com.wedding.invitationjairo.controller;

import com.wedding.invitationjairo.dto.response.ApiResponse;
import com.wedding.invitationjairo.dto.response.DashboardSummaryResponse;
import com.wedding.invitationjairo.dto.response.GuestAdminResponse;
import com.wedding.invitationjairo.dto.response.GuestMessageResponse;
import com.wedding.invitationjairo.dto.response.RegistrationStatusResponse;
import com.wedding.invitationjairo.dto.response.TodayRegistrationResponse;
import com.wedding.invitationjairo.service.AdminService;
import com.wedding.invitationjairo.service.AppSettingService;
import com.wedding.invitationjairo.service.ExcelExportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class AdminController {
    private final AdminService adminService;
    private final AppSettingService appSettingService;
    private final ExcelExportService excelExportService;

    public AdminController(
        AdminService adminService,
        AppSettingService appSettingService,
        ExcelExportService excelExportService
    ) {
        this.adminService = adminService;
        this.appSettingService = appSettingService;
        this.excelExportService = excelExportService;
    }

    @GetMapping("/admin/login")
    public String showLonginPage() {
        return "admin/login";
    }

    @GetMapping("/admin/dashboard")
    public String showDashboard() {
        return "admin/dashboard";
    }

    @ResponseBody
    @GetMapping("/admin/api/dashboard/summary")
    public DashboardSummaryResponse getDashboardSummary() {
        return adminService.getDashboardSummary();
    }

    @ResponseBody
    @GetMapping("/admin/api/guests")
    public List<GuestAdminResponse> getGuest() {
        return adminService.getAllGuestsForAdmin();
    }

    @ResponseBody
    @GetMapping("/admin/api/guests/today")
    public List<TodayRegistrationResponse> getTodayRegistrations() {
        return adminService.getTodayRegistrations();
    }

    @ResponseBody
    @DeleteMapping("/admin/api/guests/{id}")
    public ApiResponse deleteGuest(@PathVariable Long id) {
        adminService.deleteGuestGroup(id);

        return ApiResponse.ok("Invitado eliminado correctamente");
    }

    @ResponseBody
    @GetMapping("/admin/api/guests/messages")
    public List<GuestMessageResponse> getGuestMessageResponses() {
        return adminService.getGuestMessages();
    }

    @ResponseBody
    @PatchMapping("/admin/api/settings/photos")
    public ApiResponse updatePhotosStatus(@RequestParam boolean enabled) {
        appSettingService.updateSetting("photo_upload_enabled", String.valueOf(enabled));

        return ApiResponse.ok("Estado de fotos actualizado correctamente");
    }

    @GetMapping("/admin/guests/export")
    public ResponseEntity<byte[]> exportGuestsToExcel() {
        byte[] excelFile = excelExportService.exportGuestsToExcel();

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=invitados-jairo-jennifer.xlsx"
            )
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(excelFile);
    }

    @ResponseBody
    @GetMapping("/admin/api/settings/registration")
    public RegistrationStatusResponse getRegistrationStatus() {
        return appSettingService.getRegistrationStatus();
    }

    @ResponseBody
    @PatchMapping("/admin/api/settings/registration")
    public RegistrationStatusResponse updateRegistrationStatus(@RequestParam boolean enabled) {
        return appSettingService.updateRegistrationStatus(enabled);
    }
}