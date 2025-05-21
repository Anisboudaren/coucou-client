
import "../v1/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-none! bg-transparent!">
      <body
       className="bg-none! bg-transparent!"
      >    
             {children}
         
      </body>
    </html>
  );
}
