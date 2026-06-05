package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.response.RegistrationStatusResponse;
import com.wedding.invitationjairo.exception.ResourceNotFoundException;
import com.wedding.invitationjairo.model.AppSetting;
import com.wedding.invitationjairo.repository.AppSettingRepository;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AppSettingService {
    private final AppSettingRepository appSettingRepository;
    private static final int MAX_DISABLE_COUNT = 3;

    public AppSettingService(AppSettingRepository appSettingRepository) {
        this.appSettingRepository = appSettingRepository;
    }

    public String getSettingValue(String settingKey) {
        return appSettingRepository.findBySettingKey(settingKey)
            .map(AppSetting::getSettingValue)
            .orElseThrow(() -> new ResourceNotFoundException("Configuración no encontrada" + settingKey));
    }

    public boolean getBooleanSetting(String settingKey) {
        String value = getSettingValue(settingKey);
        
        return Boolean.parseBoolean(value);
    }

    public AppSetting updateSetting(String settingKey, String newValue) {
        AppSetting setting = appSettingRepository.findBySettingKey(settingKey)
            .orElseThrow(() -> new ResourceNotFoundException("Configuración no encontrada" + settingKey));

            setting.setSettingValue(newValue);
            setting.setUpdatedAt(LocalDateTime.now());

            return appSettingRepository.save(setting);
    }

    public RegistrationStatusResponse getRegistrationStatus() {
        boolean enabled = Boolean.parseBoolean(getSettingValue("registration_enabled", "true"));
        int disableCount = Integer.parseInt(getSettingValue("registration_disable_count", "0"));

        return new RegistrationStatusResponse(
                enabled,
                disableCount,
                MAX_DISABLE_COUNT,
                disableCount >= MAX_DISABLE_COUNT
        );
    }

    public RegistrationStatusResponse updateRegistrationStatus(boolean enabled) {
        RegistrationStatusResponse currentStatus = getRegistrationStatus();

        if (!enabled && currentStatus.isLocked()) {
            return currentStatus;
        }

        if (!enabled && currentStatus.isEnabled()) {
            int newCount = currentStatus.getDisableCount() + 1;
            updateSetting("registration_disable_count", String.valueOf(newCount));
        }

        updateSetting("registration_enabled", String.valueOf(enabled));

        return getRegistrationStatus();
    }

    public String getSettingValue(String key, String defaultValue) {
        return appSettingRepository.findBySettingKey(key)
                .map(AppSetting::getSettingValue)
                .orElse(defaultValue);
    }
}
