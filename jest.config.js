export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^store/(.*)$": "<rootDir>/src/store/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^validation/(.*)$": "<rootDir>/src/validation/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};