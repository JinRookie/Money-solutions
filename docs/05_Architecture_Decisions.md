```
# Architecture Decision Records (ADR)

This document records significant architectural decisions made in the MoneyManager project. 
These decisions should not be rediscovered or re-debated without explicit intent to supersede them.
Decision IDs are permanent and non-reusable.

---

## AD-001: Exclude internal transfers from daily money flow

**Context:** 
When calculating "Today's Money In" and "Today's Money Out" for the dashboard, a decision must be made about whether to include transfers. A transfer moves money from one wallet (e.g., Savings) to another (e.g., Cash).

**Decision:** 
Transfers are explicitly excluded from daily flow aggregates. Only `TransactionType.INCOME` counts as money in, and only `TransactionType.EXPENSE` counts as money out.

**Consequences / Why it matters:**
* Transfers represent internal money movement (shuffling between the user's own accounts), not new income or actual expenses leaving the user's ecosystem.
* Including transfers would artificially inflate both "Money In" and "Money Out", making the daily summary confusing and mathematically misleading for the user.
* The LedgerService handles this cleanly by isolating the filter logic in `getTodayFlow()`.

---

## AD-002: Allow negative balances (overdrafts) in Phase 1

**Context:** 
When a user creates an expense transaction, the system must decide whether to validate against the current wallet balance. Should the service block the transaction if funds are insufficient?

**Decision:** 
For Phase 1, the application allows overdrafts. `TransactionService` will not check the balance before permitting an expense. The ledger will simply compute a negative number if spending exceeds the available balance.

**Consequences / Why it matters:**
* This is a personal finance tool, not a bank ledger. Users often log expenses retroactively or split bills, which temporarily results in negative balances.
* Adding balance validation introduces complex state management (e.g., handling pending transactions, timezone edge-cases at midnight) that delays feature delivery.
* The UI will be responsible for warning the user ("Warning: Insufficient funds"), but the service layer will not hard-block the action.
* In future phases, an optional "strict mode" can be introduced via user settings.

---

## AD-003: Include archived wallets in net worth calculations

**Context:** 
When a user archives a wallet (e.g., closing a bank account), it is hidden from the active UI. The `LedgerService.getNetWorth()` function must decide whether to include the historical balance of this archived wallet.

**Decision:** 
Net worth includes all wallets where `includeInNetWorth === true`, regardless of their `isActive` status. The `isActive` flag controls UI visibility; the `includeInNetWorth` flag controls financial aggregation.

**Consequences / Why it matters:**
* Net worth reflects actual ownership, not UI activity status. If a user had QAR 10,000 in a closed bank account, that money was still part of their net worth at the time it was closed.
* Filtering by `isActive` would cause silent, incorrect drops in a user's net worth graph simply because they archived an old account.
* If a user truly wants to exclude an archived wallet from their net worth (e.g., they transferred the funds out before closing), they can toggle `includeInNetWorth` to `false` via the wallet edit screen.
```
