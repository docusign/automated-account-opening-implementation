import { Immutable } from "../utils/types";

const paths = {
  Base: "/api",
  DataIO: {
    Base: '/dataio',
    SearchRecords: {
      Post: '/searchRecords',
    },
    GetTypeNames: {
      Post: '/getTypeNames',
    },
    GetTypeDefinitions: {
      Post: '/getTypeDefinitions',
    }
  },
};

export type TPaths = Immutable<typeof paths>;
export default paths as TPaths;
