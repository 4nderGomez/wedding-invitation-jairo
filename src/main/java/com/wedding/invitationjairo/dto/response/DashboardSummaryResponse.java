package com.wedding.invitationjairo.dto.response;

public class DashboardSummaryResponse {
    private long totalGuests;
    private long totalAdults;
    private long totalChildren;
    private long totalConfirmations;
    private long totalDeclines;

    //Constructor 1
    public DashboardSummaryResponse() {

    }

    //Constructor 2
    public DashboardSummaryResponse(
        long totalGuests,
        long totalAdults,
        long totalChildren,
        long totalConfirmations,
        long totalDeclines
    ) {
        this.totalGuests = totalGuests;
        this.totalAdults = totalAdults;
        this.totalChildren = totalChildren;
        this.totalConfirmations = totalConfirmations;
        this.totalDeclines = totalDeclines;
    }

    /* --- Getters and setters --- */
    //totalGuest
    public long getTotalGuests() {
        return totalGuests;
    }

    public void setTotalGuests(long totalGuest) {
        this.totalGuests = totalGuest;
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

    //totalDeclines
    public long getTotalDeclines() {
        return totalDeclines;
    }

    public void setTotalDeclines(long totalDeclines) {
        this.totalDeclines = totalDeclines;
    }
}