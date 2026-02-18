# Backend Referral Logic Requirements

The following logic must be implemented in the Supabase Database Triggers or Edge Functions when a referred client successfully signs up (status changes to 'signed_up').

## 1. Referrer Activity Check
**Requirement:** The person who referred the client must be an **ACTIVE** Credit U student to receive points.

**Logic:**
- When `referrals.status` becomes `signed_up`:
  - Fetch the `profiles` record for the `referrer_id`.
  - Check if `academic_level` is not null or if `has_completed_orientation` is true (defining "Active").
  - If **Active**:
    - Award 2,600 Moo Points to the referrer.
    - Insert transaction into `points_transactions`.
  - If **Not Active**:
    - **Do NOT** award points yet.
    - Trigger the **Encouragement Email**.

## 2. Encouragement Email
**Requirement:** If the referrer is not yet signed up/active, send them an email updates them that their referral joined and encourages them to complete their own enrollment.

**Logic:**
- Trigger an email to the referrer's email address.
- **Subject:** Great news! Someone you referred just joined Credit U!
- **Body:** 
  - "Hi [Referrer Name], one of your friends just initialized their Credit U sequence using your code! 
  - To claim your **2,600 Moo Points** reward, you just need to complete your own enrollment and become an active student.
  - Finish your Dorm Week Orientation now to unlock your rewards: [Link to Orientation]"

## 3. Accountabilliity Partnership
**Logic:**
- Handled via the frontend `ReferralThanksForm`.
- If a user opts-in, a record is created in the `accountability_partners` table connecting the referrer and referred students.
- Both students should then see each other's progress in their respective dashboards.
