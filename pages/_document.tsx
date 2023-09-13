import { Html, Head } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src="../node_modules/mathjax/es5/tex-chtml.js"
          id="MathJax-script"
          async
        ></script>
      </Head>
    </Html>
  );
}
