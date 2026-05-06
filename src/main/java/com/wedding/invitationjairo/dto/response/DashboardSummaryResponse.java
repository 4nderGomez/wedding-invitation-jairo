package com.wedding.invitationjairo.dto.response;

public class DashboardSummaryResponse {
    private long totalGuest;
    private long totalAdults;
    private long totalChildren;
    private long totalConfirmations;

    //Constructor 1
    public DashboardSummaryResponse() {

    }

    //Constructor 2
    public DashboardSummaryResponse(
        long totalGuest,
        long totalAdults,
        long totalChildren,
        long totalConfirmations
    ) {
        this.totalGuest = totalGuest;
        this.totalAdults = totalAdults;
        this.totalChildren = totalChildren;
        this.totalConfirmations = totalConfirmations;
    }

    /* --- Getters and setters --- */
    //totalGuest
    public long getTotalGuest() {
        return totalGuest;
    }

    public void setTotalGuest(long totalGuest) {
        this.totalGuest = totalGuest;
    }

    //totalAdults
    public long getTotalAdults() {
        return totalAdults;
    }

    public void setTotalAdults(long totalAdults) {
        this.totalAdults = totalAdults;
    }

    //totalChildren
    public long getTotalChildren() {
        return totalChildren;
    }

    public void setTotalChildren(long totalChildren) {
        this.totalChildren = totalChildren;
    }

    //totalConfirmations
    public long getTotalConfirmations() {
        return totalConfirmations;
    }

    public void setTotalConfirmations(long totalConfirmations) {
        this.totalConfirmations = totalConfirmations;
    }
}