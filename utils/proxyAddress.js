import proxy from "proxy-addr";

export const getClientIp = (req) => {
    // Use proxy-addr to get the client IP from the request
    return proxy(req, ['loopback', 'linklocal', 'uniquelocal']);
  }