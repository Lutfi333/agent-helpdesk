export default function Footer() {
  return (
    <footer className="bg-white text-default-100 h-[auto] py-2 z-20">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div>
            <p className="text-sm text-slate-600 ">
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
