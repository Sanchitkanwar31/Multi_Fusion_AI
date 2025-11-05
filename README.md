# ThinkSync

**ThinkSync** is an advanced multi-AI collaboration platform that seamlessly integrates various large language models (LLMs) such as Gemini, Groq (LLaMA), and others. It allows users to interact with multiple AI agents in a single chat interface, compare responses, manage credits, and upgrade subscription plans — all within an elegant and responsive Next.js application.

---

##  Features

###  Multi-AI Collaboration

* Engage multiple AI models in one conversation.
* Dynamically select and compare responses from different models.
* Supports context-aware interactions using shared prompts.

###  Authentication & User Management

* Integrated with **Clerk** for authentication and user session handling.
* Secure and persistent user data management.

###  Credit Management System

* Tracks free message credits per user.
* Displays remaining credits and restricts access after daily limits.
* Option to upgrade to premium/unlimited plans.

###  Chat History

* Each user’s conversations are stored and retrieved using **Firebase Firestore**.
* Displays previous chat summaries and last message timestamps.


### 💳 Subscription Plans

* Integrated **Pricing Model** component for users to upgrade their plans.
* Shows usage credits and provides a smooth transition to paid features.

---

##  Tech Stack

| Layer                      | Technologies                                 |
| -------------------------- | -------------------------------------------- |
| **Frontend**               | Next.js 14, React, Tailwind CSS, ShadCN/UI   |
| **Auth & User Management** | Clerk Authentication                         |
| **Backend**                | Kravix.com (API Routes), Axios for API handling |
| **Database**               | Firebase Firestore                           |


---

##  Project Structure

```
ThinkSync/
│── app/
│   ├── _components/
│   │   ├── AppSidebar.jsx
│   │   ├── ChatInputBox.jsx
│   │   ├── AiMultiModels.jsx
│   │   ├── UsageCredit.jsx
│   │   └── Pricingmodel.jsx
│   ├── page.js
│── context/
│   └── AimSelectedModelContext.js
│── config/
│   ├── FirebaseConfig.js
│   └── Arcjet.js
│── public/
│── package.json
│── README.md
│── .env.local
```

---

##  Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sanchitkanwar31/ThinkSync.git
   cd ThinkSync
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Visit the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.


---

##  Key Components

### **AppSidebar.jsx**

Handles the sidebar UI, including user authentication, theme toggling, chat history retrieval, and usage credit display.

### **AiMultiModels.jsx**

Core component that enables multi-AI conversations, switching between models, and displaying responses side-by-side.

### **UsageCredit.jsx**

Displays the remaining daily credits for a user and prompts them to upgrade when limits are reached.

### **Pricingmodel.jsx**

Contains pricing logic and modal display for subscription upgrades.

---

##  Future Enhancements

* Add support for more AI models along with agents.
* Integrate real-time streaming of responses.
* Implement chat sharing and export features.
* Add analytics for AI performance comparison.

---
##  Deployment

* This project is deployed on Vercel and accessible at
 https://multi-fusion-afa19euqs-sanchitkanwar31s-projects.vercel.app/
.

---

##  Author

**Sanchit Kanwar**
[GitHub](https://github.com/Sanchitkanwar31)

---

##  License

This project is licensed under the **MIT License** — feel free to use and modify it for your own purposes.
