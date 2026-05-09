package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.model.GuestCompanion;
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

    public ExcelExportService(GuestGroupRepository guestGroupRepository){
        this.guestGroupRepository = guestGroupRepository;
    }

    public void createHeaderRow(Sheet sheet) {
        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Nombre y apellidos");
        header.createCell(1).setCellValue("Invidato de");
        header.createCell(2).setCellValue("Tipo de invitado");
        header.createCell(3).setCellValue("Télefono");
        header.createCell(4).setCellValue("Correo");
        header.createCell(5).setCellValue("Adulto/Niño");
        header.createCell(6).setCellValue("Asistencia");
        header.createCell(7).setCellValue("Fecha de registro");
    }

    public void fillGuestRows(Sheet sheet, List<GuestGroup> guestGroups) {
        int rowIndex = 1;

        for(GuestGroup guestGroup : guestGroups) {
            Row principalRow = sheet.createRow(rowIndex++);

            principalRow.createCell(0).setCellValue(
                guestGroup.getMainFirstName() + " " + guestGroup.getMainLastName()
            );
            principalRow.createCell(1).setCellValue(guestGroup.getGuestSide().name());
            principalRow.createCell(2).setCellValue(guestGroup.getGuestType().name());
            principalRow.createCell(3).setCellValue(guestGroup.getPhone() != null ? guestGroup.getPhone() : "");
            principalRow.createCell(4).setCellValue(guestGroup.getEmail() != null ? guestGroup.getEmail() : "");
            principalRow.createCell(5).setCellValue(guestGroup.getAgeGroup().name());
            principalRow.createCell(6).setCellValue(guestGroup.getAttendanceStatus().name());
            principalRow.createCell(7).setCellValue(guestGroup.getRegisteredAt().toString());
        
            if(guestGroup.getCompanions() != null) {
                for(GuestCompanion companion :guestGroup.getCompanions()) {
                    Row companionRow = sheet.createRow(rowIndex++);

                    companionRow.createCell(0).setCellValue(
                        companion.getFirstName() + " " + companion.getLastName()
                    );
                    principalRow.createCell(1).setCellValue(guestGroup.getGuestSide().name());
                    principalRow.createCell(2).setCellValue(companion.getGuestType().name());
                    principalRow.createCell(3).setCellValue("");
                    principalRow.createCell(4).setCellValue("");
                    principalRow.createCell(5).setCellValue(companion.getAgeGroup().name());
                    principalRow.createCell(6).setCellValue(guestGroup.getAttendanceStatus().name());
                    principalRow.createCell(7).setCellValue(guestGroup.getRegisteredAt().toString());
                }
            }
        }

        for(int i = 0; i <= 7; i++)
            sheet.autoSizeColumn(i);
    }

    public byte[] exportGuestsToExcel() {
        List<GuestGroup> guestGroups = guestGroupRepository.findAll();

        try (
            Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
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
}
