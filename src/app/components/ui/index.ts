/**
 * UI Components Index - Feliona AI
 * Централизованные экспорты всех UI компонентов
 */

// === БАЗОВЫЕ UI КОМПОНЕНТЫ ===
export { 
  Button, 
  type ButtonProps,    
  type ButtonSize 
} from './Button';

export { 
  Modal, 
  ModalFooter, 
  type ModalProps,   
  type ModalSize 
} from './Modal';

export {
  Card,
  CardHeader,
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardPadding,
  type CardAsDivProps,
  type CardAsLinkProps
} from './Card';

// === СПЕЦИАЛИЗИРОВАННЫЕ КАРТОЧКИ ===
export {
  CharacterCard,
  type CharacterCardProps,
  PricingCard, 
  type PricingCardProps
} from './Card';

// === КОНСТАНТЫ И ТИПЫ ===
// Импортируем из централизованного файла констант
export {
  UI_VARIANTS,
  UI_COMPONENTS, // для обратной совместимости
  type ButtonVariant,
  type CardVariant,
  type ModalVariant,
  isValidButtonVariant,
  isValidCardVariant,
  isValidModalVariant
} from '../../../types/ui/constants';