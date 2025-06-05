import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { clearError } from "store/authSlice";
import { loginSchema } from "validation/authSchemas";
import type { RootState } from "store";
import type { AppDispatch } from "store";
import { login } from "store/authThunk";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await dispatch(login(values)).unwrap();
      navigate("/dashboard");
    },
  });

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-illustration">
          <img
            src="/background-signin.png"
            alt="Login Illustration"
            style={{ width: "100%", maxWidth: 400 }}
          />
        </div>
        <div className="signup-form-wrapper">
          <div className="auth-form">
            <h4>Welcome to ReactJs Test Interview!</h4>
            <p className="text-muted mb-4" style={{ fontSize: 13 }}>
              Please sign-in to your account and start the adventure
            </p>
            {error && (
              <Alert color="danger" className="mb-4">
                {error}
              </Alert>
            )}
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="email">Email*</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  invalid={formik.touched.email && !!formik.errors.email}
                  disabled={loading}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-message">{formik.errors.email}</div>
                )}
              </FormGroup>
              <FormGroup>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Label for="password" style={{ marginBottom: 0 }}>
                    Password*
                  </Label>
                  <Link to="/forgot-password" style={{ fontSize: 13 }}>
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  invalid={formik.touched.password && !!formik.errors.password}
                  disabled={loading}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error-message">{formik.errors.password}</div>
                )}
              </FormGroup>
              <FormGroup
                check
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "1.5em",
                }}
              >
                <Input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  onChange={formik.handleChange}
                  checked={formik.values.remember}
                  disabled={loading}
                  style={{ marginRight: 8 }}
                />
                <Label
                  htmlFor="remember"
                  check
                  style={{ marginBottom: 0, cursor: "pointer" }}
                >
                  Remember me
                </Label>
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                block
                disabled={loading || !formik.isValid}
                style={{ marginBottom: 10 }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Login
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
            <div className="auth-links mb-2">
              <span style={{ fontSize: 13 }}>
                New on our platform? <Link to="/signup">Create an account</Link>
              </span>
            </div>
            <div
              className="text-center mb-2"
              style={{ fontSize: 12, color: "#888" }}
            >
              or
            </div>
            <div className="d-flex justify-content-center gap-2">
              <Button
                color="primary"
                outline
                size="sm"
                className="rounded-circle"
              >
                <i className="fab fa-facebook-f"></i>
              </Button>
              <Button color="info" outline size="sm" className="rounded-circle">
                <i className="fab fa-twitter"></i>
              </Button>
              <Button
                color="danger"
                outline
                size="sm"
                className="rounded-circle"
              >
                <i className="fab fa-google"></i>
              </Button>
              <Button color="dark" outline size="sm" className="rounded-circle">
                <i className="fab fa-github"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
