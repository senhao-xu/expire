import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AssetFormPage } from "./pages/AssetFormPage";
import { AssetDetailPage } from "./pages/AssetDetailPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"                  element={<HomePage />} />
        <Route path="/assets/new"        element={<AssetFormPage />} />
        <Route path="/assets/:id"        element={<AssetDetailPage />} />
        <Route path="/assets/:id/edit"   element={<AssetFormPage />} />
        <Route path="/settings"          element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}
