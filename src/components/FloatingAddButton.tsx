import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        size="lg"
        onClick={onClick}
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};