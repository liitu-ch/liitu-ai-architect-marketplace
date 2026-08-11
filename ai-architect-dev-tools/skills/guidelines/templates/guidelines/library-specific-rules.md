# Library-Specific Rules

Rules per key dependency from `package.json`, checked against the official documentation (via Context7).
{If Context7 was unavailable: note that these rules are based on the codebase scan only.}

| Library               | Version | Rule                                                                                   | Source                             |
| --------------------- | ------- | -------------------------------------------------------------------------------------- | ---------------------------------- |
| {e.g., @mui/material} | {x.y.z} | {e.g., extend components via `styled()`/theme overrides — never copy component source} | {Official docs / Project decision} |

{Known deviations from official recommendations and the agreed handling, if any.}
