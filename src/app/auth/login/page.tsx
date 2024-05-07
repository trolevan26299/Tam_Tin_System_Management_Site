// sections
import { JwtLoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
