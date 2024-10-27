# 🌟 **Simple LARP: A Simplified Framework for AI-Powered TTRPGs** 🌟

## 🚀 **Overview**

This project is part of my ongoing journey to explore and understand how **Generative AI** can enhance **tabletop role-playing games (TTRPGs)**. By combining my passion for **narrative-driven games** and **AI technologies**, I am building a system that leverages **pre-trained Large Language Models (LLMs)** from **AWS Bedrock** and **OpenAI** to create dynamic, AI-powered NPCs and in-game agents.

The goal is to use AI to simulate complex character behaviors, personalities, and memory-driven decisions, allowing for richer storytelling experiences in an at-home TTRPG setting. This project serves as a way to deepen my understanding of how generative AI models can interact with human creativity in a narrative context, connecting my hobbies with professional skills.

---

## 🎯 **Project Goals**

- **Education through Experimentation**: The project serves as a learning tool for exploring how Generative AI models can be integrated into narrative-driven environments.
- **Separation of Concerns**: The project maintains a strict separation between the **UX (frontend)** and **domain services** layers via a **Backend for Frontend (BFF)** pattern. This approach ensures that the front-end and back-end can evolve independently, promoting scalability and transferability of lessons to other projects.
- **Exploring Functionality within AWS Bedrock**: From Claude to Titan, using the Converse API and Agents, I intend to explore the boundaries within the Bedrock space, within budgetary considerations.
- **Scalable Architecture**: The project is developed with **modularity** in mind, allowing for easy extension of features and AI models as new capabilities are explored.
- **Implementing Agentic Systems**: Building a basic agentic system with entities like **Agents**, **Tools**, **Sessions**, and **Interactions**, designed following **Domain-Driven Design (DDD)** principles.

---

## 🛠️ **Technology Stack**

- **Infrastructure**: Built using **AWS CDK** for easy and scalable cloud deployment.
- **Backend Services**:
  - Stateless backend services and domain-driven logic powered by AWS **Lambda**, **API Gateway**, and **DynamoDB**.
  - **TypeScript** used for backend development, following **Domain-Driven Design (DDD)** principles.
- **Frontend**: A **React** UI interacting with the backend via a **BFF** (Backend for Frontend) pattern.
- **Generative AI Models**:
  - **AWS Bedrock** for tasks such as **semantic analysis**, **chat interfaces**, and **context embeddings**.
  - **OpenAI** models may be integrated for specific functionalities as needed.

---

## 🏗️ **Project Structure**

The project is structured to reflect **Clean/Hexagonal Architecture**, separating business logic, infrastructure, and interfaces:

```plaintext
root/
│
├── cdk/                     # AWS CDK infrastructure definitions
├── src/                     # Application source code
│   ├── adapters/
│   │   ├── primary/         # Interfaces for primary adapters (e.g., controllers)
│   │   ├── secondary/       # Interfaces for secondary adapters (e.g., database access)
│   ├── config/              # Configuration files and environment variables
│   ├── domain/              # Core business entities and logic
│   │   ├── entities/        # Entities like Agent, Tool, Session, Interaction
│   │   ├── services/        # Domain services, e.g., SessionManager
│   ├── dto/                 # Data Transfer Objects
│   ├── errors/              # Custom error classes
│   ├── events/              # Domain events
│   ├── repositories/        # Repository interfaces and implementations
│   ├── schemas/             # Validation schemas
│   ├── shared/              # Shared utilities and helpers
│   ├── use-cases/           # Application use cases
├── tests/                   # Jest and Postman tests
├── types/                   # Shared types and interfaces
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

### **Additional References**:

- **Domain-Driven Design (DDD)**: The project employs DDD principles to model complex domain logic. For more information, see Domain-Driven Design Reference.
- **AWS Bedrock Documentation**: Utilizing AWS Bedrock services such as the Converse API. See AWS Bedrock Documentation.
- **Design Patterns**: Applying patterns like Strategy, Observer, and Decorator to enhance system flexibility. Refer to Design Patterns: Elements of Reusable Object-Oriented Software.

While I will provide a high-level overview of the paper's concepts, I encourage readers to explore the paper for a deeper understanding of the underlying framework.

---

## 🛠️ **Planned Milestones**

- **Phase 1: Domain Services** – Build out the core domain services, focusing on **LLM-powered agent memory, personality management, and decision-making, and implementing Agents, Tools, Sessions, and Interactions**.
- **Phase 2: CRUD Implementation** – Develop CRUD functionality for managing agents, tools, sessions, and interactions. Test data can be generated using LLMs to facilitate testing before full CRUD is implemented.
- **Phase 3: UX & BFF** – Initial development of the UI and interaction layer, focusing on integration with backend services.
- **Phase 4: Testing and Refinement** – Integration testing with **Postman** and unit testing with **Jest** to validate the correctness of the domain services and backend logic.
- **Phase 5: Advanced Features** – Implementing features like agent hand-off, multi-agent interactions, and flow control within sessions.

---

## 📦 **Deployment**

The project is designed to be deployed using **AWS CDK**. An example environment configuration file will be added later to simplify deployment. Placeholder environment variables will be provided in the initial deployment.

---

## 🔮 **Future Directions**

- **Contextual Model Mapping**: Developing a more granular mapping of which tasks are handled by AWS Bedrock vs. OpenAI models as the project matures.
- **Expanded Decision-Making**: Exploring how fine-tuning models or building custom AI models can further improve decision-making for agents.
- **Tool Extensibility**: Implementing and extending tools on a function-by-function basis, allowing for specific behaviors and actions within the agent system.
- **Enhanced Orchestration**: Distributing the functionality of the Swarm Orchestrator into entities like Session and Agent to manage complex agent interactions and hand-offs.
- **Event-Driven Architecture**: Incorporating event sourcing and CQRS patterns to handle complex workflows and improve scalability.

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
