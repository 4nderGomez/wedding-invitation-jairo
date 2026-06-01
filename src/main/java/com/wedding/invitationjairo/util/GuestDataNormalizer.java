package com.wedding.invitationjairo.util;

import java.text.Normalizer;

public final class GuestDataNormalizer {
    private GuestDataNormalizer() {

    }

    public static String normalizeText(String value) {
        if(value == null)
            return null;

        String normalized = value.trim().toLowerCase();

        normalized = Normalizer.normalize(normalized, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "");

        normalized = normalized
            .replaceAll("[.,]", "")
            .replaceAll("\\s+", " ")
            .trim();

        return normalized.isEmpty() ? null : normalized;
    }

    public static String normalizeFullName(String firstName, String lastName) {
        String normalizedFirstName = normalizeText(firstName);
        String normalizedLastName = normalizeText(lastName);

        if(normalizedFirstName == null || normalizedLastName == null)
            return null;

        return normalizedFirstName + " " + normalizedLastName;
    }

    public static String normalizeEmail(String email) {
        if(email == null)
            return null;

        String normalizedEmail = email.trim().toLowerCase();

        return normalizedEmail.isEmpty() ? null : normalizedEmail;
    }

    public static String normalizePhone(String phone) {
        if(phone == null)
            return null;

        String digitsOnly = phone.replaceAll("\\D", "");

        return digitsOnly.isEmpty() ? null : digitsOnly;
    }
}
