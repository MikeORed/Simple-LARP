# 🌟 **Simple LARP: A Simplified Framework for AI-Powered TTRPGs** 🌟

## 🚀 **Overview**

This project is part of my ongoing journey to explore and understand how **generative AI (Generative AI)** can enhance **tabletop role-playing games (TTRPGs)**. By combining my passion for **narrative-driven games** and **AI technologies**, I am building a system that leverages **pre-trained LLMs** from **AWS Bedrock** and **OpenAI** to create dynamic, AI-powered NPCs and in-game agents.

The goal is to use AI to simulate complex character behaviors, personalities, and memory-driven decisions, allowing for richer storytelling experiences in an at-home TTRPG setting. This project serves as a way to deepen my understanding of how generative AI models can interact with human creativity in a narrative context, connecting my hobbies with professional skills.

---

## 🎯 **Project Goals**

- **Education through Experimentation**: The project will serve as a learning tool for exploring how Generative AI models can be integrated into narrative-driven environments.
- **Separation of Concerns**: The project will maintain a strict separation between the **UX (frontend)** and **domain services** layers via a **Backend for Frontend (BFF)** pattern. This approach ensures that the front-end and back-end can evolve independently, promoting scalability and transferability of lessons to other projects.
- **Exploring Pre-Trained LLMs**: Both **AWS Bedrock** and **OpenAI’s models** will be leveraged depending on context. The exact mapping of models will evolve as the project matures.
- **Scalable Architecture**: The game will be developed with **modularity** in mind, allowing for the easy extension of features and AI models as new capabilities are explored.

---

## 🛠️ **Technology Stack**

- **Infrastructure**: Built using **AWS CDK** for easy and scalable cloud deployment.
- **Backend Services**: Stateless backend services and domain-driven logic will be powered by AWS **Lambda**, **API Gateway**, and **DynamoDB**.
- **Frontend**: A **React** UI will interact with the backend via a **BFF** (Backend for Frontend) pattern.
- **Generative AI Models**:
  - **AWS Bedrock** for tasks such as **semantic analysis** and **context embeddings**.
  - **OpenAI** for tasks like **personality-driven dialogues** and **interaction modeling**.

---

## 🏗️ **Project Structure**

The project is structured to reflect **Clean/Hexagonal Architecture**, separating business logic, infrastructure, and interfaces:

```plaintext
root/
│
├── cdk/                     # AWS CDK infrastructure definitions
├── src/                     # Application source code
│   ├── application/          # Application services and use cases
│   ├── domain/               # Core business entities and logic
│   ├── infrastructure/       # Adapters for external services (e.g., DynamoDB, Bedrock, OpenAI)
├── tests/                   # Jest and Postman tests
├── types/                   # Shared types and DTOs
└── README.md                # Project documentation
```

---

## ✅ **Testing**

- **Test Data Generation**: Test data will be dynamically generated via **LLMs** to simulate realistic agent interactions, making it easier to test complex agent states and interactions.
- **Testing Framework**:
  - **Jest** will be used for unit testing core logic and services.
  - **Postman** will be used to perform **integration and API testing** for the domain services layer, ensuring that API endpoints work correctly in an end-to-end environment.

---

## 📚 **Reference: Academic Paper**

The project is inspired by and will reference the concepts in the paper titled:

**“LARP: Language-Agent Role-Play Framework for Open-World Simulations”**  
_(You can read the full paper here: [LARP Framework - arXiv](https://arxiv.org/abs/2312.17653))_

### **Key Concepts from the Paper**:

- **Cognitive Agents**: Simulating agents with dynamic personalities, memory recall, and decision-making capabilities using AI.
- **Memory Models**: Handling both **episodic** and **semantic memory** for agents.
- **Personality-Driven Actions**: Agents make decisions based on their personality, emotional state, and memories, allowing for more dynamic interactions.

While I will provide a high-level overview of the paper's concepts, I encourage readers to explore the paper for a deeper understanding of the underlying framework.

---

## 🛠️ **Planned Milestones**

- **Phase 1: Domain Services** – Build out the core domain services, focusing on **LLM-powered agent memory, personality management, and decision-making**.
- **Phase 2: CRUD Implementation** – Develop CRUD functionality for managing agents, memories, and personalities. This will be handled later in the project since test data can be easily generated using LLMs.
- **Phase 3: UX & BFF** – Initial development of the UI and interaction layer, focusing on basic integration with backend services.
- **Phase 4: Testing and Refinement** – Integration testing with **Postman** and unit testing with **Jest** to validate the correctness of the domain services and backend logic.

---

## 📦 **Deployment**

The project is designed to be deployed using **AWS CDK**. An example environment configuration file will be added later to simplify deployment. Placeholder environment variables will be provided in the initial deployment.

---

## 🔮 **Future Directions**

- **Contextual Model Mapping**: As the project matures, a more granular mapping of which tasks are handled by AWS Bedrock vs. OpenAI models will be developed.
- **Expanded Decision-Making**: In future phases, I plan to explore how fine-tuning models or building custom AI models can further improve decision-making for agents.

---

## 📝 **License & Contribution**

- **License**: The project will initially be under a **restrictive license**, with broader release under a more permissive license as the project matures.
- **Contributions**: Contributions are currently restricted, but information on contributing and the license will be updated in future iterations.

---

## 💡 **How to Get Started**

1. **Clone the Repository**: `git clone [repository-url]`
2. **Install Dependencies**: `npm install`
3. **Deploy with CDK**: `cdk deploy`
4. **Run Tests**: `npm test` (Jest) / **Postman** tests can be imported via the provided collection.

---

## 📬 **Contact**

For more information or to discuss collaboration, feel free to reach out via [contact information].
