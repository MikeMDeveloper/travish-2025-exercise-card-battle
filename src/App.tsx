import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageList } from "./pages/PageList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageList />
    </QueryClientProvider>
  );
}

export default App;
