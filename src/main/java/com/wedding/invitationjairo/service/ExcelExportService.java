package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.repository.GuestGroupRepository;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {
    private final GuestGroupRepository guestGroupRepository;

    public ExcelExportService(GuestGroupRepository guestGroupRepository) {
        this.guestGroupRepository = guestGroupRepository;
    }

    public void createHeaderRow(Sheet sheet) {
        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Nombre y apellidos");
        header.createCell(1).setCellValue("Invitado de");
        header.createCell(2).setCellValue("Teléfono");
        header.createCell(3).setCellValue("Correo");
        header.createCell(4).setCellValue("Asistencia");
        header.createCell(5).setCellValue("Adultos acompañantes");
        header.createCell(6).setCellValue("Niños acompañantes");
        header.createCell(7).setCellValue("Total invitados");
        header.createCell(8).setCellValue("Fecha de registro");
    }

    public void fillGuestRows(Sheet sheet, List<GuestGroup> guestGroups) {
        int rowIndex = 1;

        for (GuestGroup guestGroup : guestGroups) {
            Row row = sheet.createRow(rowIndex++);

            int adultCompanions = safeCount(guestGroup.getAdultCompanionsCount());
            int childCompanions = safeCount(guestGroup.getChildCompanionsCount());

            int totalGuests = guestGroup.getAttendanceStatus().name().equals("ATTENDING")
                    ? 1 + adultCompanions + childCompanions
                    : 0;

            row.createCell(0).setCellValue(
                    guestGroup.getMainFirstName() + " " + guestGroup.getMainLastName()
            );
            row.createCell(1).setCellValue(guestGroup.getGuestSide().name());
            row.createCell(2).setCellValue(guestGroup.getPhone() != null ? guestGroup.getPhone() : "");
            row.createCell(3).setCellValue(guestGroup.getEmail() != null ? guestGroup.getEmail() : "");
            row.createCell(4).setCellValue(guestGroup.getAttendanceStatus().name());
            row.createCell(5).setCellValue(adultCompanions);
            row.createCell(6).setCellValue(childCompanions);
            row.createCell(7).setCellValue(totalGuests);
            row.createCell(8).setCellValue(guestGroup.getRegisteredAt().toString());
        }

        for (int i = 0; i <= 8; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    public byte[] exportGuestsToExcel() {
        List<GuestGroup> guestGroups = guestGroupRepository.findAll();

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
        ) {
            Sheet sheet = workbook.createSheet("Invitados");
            createHeaderRow(sheet);
            fillGuestRows(sheet, guestGroups);
            workbook.write(outputStream);

            return outputStream.toByteArray();
        } catch (IOException exception) {
            throw new RuntimeException("Error al generar archivo Excel", exception);
        }
    }

    private int safeCount(Integer value) {
        return value == null ? 0 : value;
    }
}
