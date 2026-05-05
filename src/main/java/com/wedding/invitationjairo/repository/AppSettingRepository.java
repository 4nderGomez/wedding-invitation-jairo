package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.model.AppSetting;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface AppSettingRepository extends JpaRepository<AppSetting, Long> {
    Optional<AppSetting> findBySettingKey(String settingKey);
}
