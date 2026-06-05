package com.wedding.invitationjairo.dto.response;

public class RegistrationStatusResponse {
    private boolean enabled;
    private int disableCount;
    private int maxDisableCount;
    private boolean locked;

    public RegistrationStatusResponse() {

    }

    public RegistrationStatusResponse(
            boolean enabled,
            int disableCount,
            int maxDisableCount,
            boolean locked
    ) {
        this.enabled = enabled;
        this.disableCount = disableCount;
        this.maxDisableCount = maxDisableCount;
        this.locked = locked;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getDisableCount() {
        return disableCount;
    }

    public int getMaxDisableCount() {
        return maxDisableCount;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setDisableCount(int disableCount) {
        this.disableCount = disableCount;
    }

    public void setMaxDisableCount(int maxDisableCount) {
        this.maxDisableCount = maxDisableCount;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }
}