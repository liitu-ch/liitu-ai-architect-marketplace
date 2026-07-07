import { describe, it, expect } from "vitest";

// ─── Mapper / Adapter Tests ─────────────────────────────────────────
// Test data transformations between external formats and internal models.

interface SapCustomer {
  KUNNR: string;
  NAME1: string;
  ORT01: string;
}

interface Customer {
  id: string;
  name: string;
  city: string;
}

function mapSapCustomer(sap: SapCustomer): Customer {
  return {
    id: sap.KUNNR,
    name: sap.NAME1,
    city: sap.ORT01,
  };
}

describe("mapSapCustomer", () => {
  it("maps SAP fields to domain model", () => {
    const sapData: SapCustomer = {
      KUNNR: "0001000042",
      NAME1: "Muster AG",
      ORT01: "Zürich",
    };

    expect(mapSapCustomer(sapData)).toEqual({
      id: "0001000042",
      name: "Muster AG",
      city: "Zürich",
    });
  });

  it("preserves leading zeros in external keys", () => {
    const sapData: SapCustomer = {
      KUNNR: "0000000007",
      NAME1: "Beispiel GmbH",
      ORT01: "Bern",
    };

    expect(mapSapCustomer(sapData).id).toBe("0000000007");
  });

  it("handles empty strings", () => {
    const sapData: SapCustomer = {
      KUNNR: "",
      NAME1: "",
      ORT01: "",
    };

    expect(mapSapCustomer(sapData)).toEqual({
      id: "",
      name: "",
      city: "",
    });
  });
});

// ─── Text Normalization ─────────────────────────────────────────────
// Wherever mapped text is compared or searched, normalize both sides —
// visually identical strings can differ in Unicode form (é as one code
// point vs. e + combining accent) and break search in production.

function matchesSearch(value: string, query: string): boolean {
  const normalize = (s: string) => s.normalize("NFC").toLocaleLowerCase();
  return normalize(value).includes(normalize(query));
}

describe("matchesSearch", () => {
  it("finds names regardless of Unicode normalization form", () => {
    const decomposed = "Ze\u0301visse"; // "Zévisse" with é as e + combining accent (U+0301)
    expect(matchesSearch(decomposed, "Zévisse")).toBe(true);
  });

  it("matches accented input case-insensitively", () => {
    expect(matchesSearch("Müller Café", "müller café")).toBe(true);
  });
});

// ─── Regression Tests ───────────────────────────────────────────────
// Pin every fixed mapping bug with a test named after the business rule
// it enforces, so the bug class cannot silently return.

function deriveMaterialNumber(reference: string): string {
  // BR-XXX: material number = reference padded to 18 digits
  return reference.padStart(18, "0");
}

describe("deriveMaterialNumber", () => {
  // Regression for BR-XXX: an endsWith() shortcut matched the wrong
  // materials for references sharing a suffix.
  it("BR-XXX: derives the full padded number instead of suffix matching", () => {
    expect(deriveMaterialNumber("2001234")).toBe("000000000002001234");
    expect(deriveMaterialNumber("1234")).not.toBe(
      deriveMaterialNumber("2001234"),
    );
  });
});
