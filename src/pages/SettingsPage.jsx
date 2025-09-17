import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { FiSave } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';
import { FaArrowCircleRight } from "react-icons/fa";
import ButtonForm from '../components/ui/ButtonForm';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: false,
  });

  const handleChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Simuler une sauvegarde
    toast.success('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-2xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Paramètres de l'application
      </motion.h2>

      <div className="bg-white dark:bg-surface shadow rounded-lg divide-y divide-gray-200 dark:divide-darkborder dark:text-darktext-primary dark:border-darkborder border border-gray-200">
        {[
          {
            label: 'Notifications',
            key: 'notifications',
            description: 'Recevez les notifications importantes sur vos actions et alertes.'
          },
          {
            label: 'Sauvegarde automatique',
            key: 'autoSave',
            description: 'Sauvegarde automatique de vos changements sans confirmation.'
          },
        ].map(({ label, key, description }) => (
          <div key={key} className="flex items-center justify-between px-6 py-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <Switch
              checked={settings[key]}
              onChange={() => handleChange(key)}
              className={`${settings[key] ? 'bg-brandgreen' : 'bg-gray-300'}
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </Switch>
          </div>
        ))}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Marqueur</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gestion des marqueurs</p>
          </div>
          <ButtonForm
          variant="success"
          onClick={() => navigate('/dashboard/list-marqueurs')}
          icon={<FaArrowCircleRight className="w-4 h-4" />}
          />
           </div>

      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brandgreen hover:bg-brandblue hover:text-brandgreen rounded-full shadow"
        >
          <FiSave /> Sauvegarder
        </button>
      </div>
    </div>
  );
}
