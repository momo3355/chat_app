import React, { useState, useCallback, useImperativeHandle, type ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { filterBarStyles as styles } from '../styles/FilterBar.styles';
import AgeRangeModal from './AgeRangeModal';
import { REGION_ITEMS, GENDER_ITEMS, REGIONS } from '../utils/Utils';

type ActiveFilter = 'area' | 'gender' | 'age' | null;

export interface SearchFilterBarHandle {
  close: () => void;
}

interface Props {
  filterArea: number | null;
  filterGender: string | null;
  filterAgeFrom: number | null;
  filterAgeTo: number | null;
  onAreaChange: (area: number | null) => void;
  onGenderChange: (gender: string | null) => void;
  onAgeChange: (from: number | null, to: number | null) => void;
  prefixSlot?: ReactNode;
  suffixSlot?: ReactNode;
  extraDropdown?: ReactNode;
  ages?: number[];
  children: ReactNode;
  onAnyOpen?: () => void;
}

const SearchFilterBarComponent = React.forwardRef<SearchFilterBarHandle, Props>(({
  filterArea, filterGender, filterAgeFrom, filterAgeTo,
  onAreaChange, onGenderChange, onAgeChange,
  prefixSlot, suffixSlot, extraDropdown,
  ages,
  children,
  onAnyOpen,
}, ref) => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [tempAgeFrom, setTempAgeFrom] = useState(ages ? ages[0] : 19);
  const [tempAgeTo, setTempAgeTo] = useState(ages ? ages[ages.length - 1] : 99);

  useImperativeHandle(ref, () => ({
    close: () => setActiveFilter(null),
  }), []);

  const minAge = ages ? ages[0] : 19;
  const maxAge = ages ? ages[ages.length - 1] : 99;

  const areaLabel = filterArea ? REGIONS[filterArea - 1] : '지역';
  const genderLabel = filterGender === 'M' ? '남' : filterGender === 'W' ? '여' : '성별';
  const ageLabel = filterAgeFrom !== null ? `${filterAgeFrom}~${filterAgeTo ?? maxAge}세` : '나이';

  const handleConfirmAge = useCallback(() => {
    const from = Math.min(tempAgeFrom, tempAgeTo);
    const to = Math.max(tempAgeFrom, tempAgeTo);
    const isDefault = from === minAge && to === maxAge;
    onAgeChange(isDefault ? null : from, isDefault ? null : to);
    setActiveFilter(null);
  }, [tempAgeFrom, tempAgeTo, minAge, maxAge, onAgeChange]);

  const areaActive   = filterArea !== null    || activeFilter === 'area';
  const genderActive = filterGender !== null  || activeFilter === 'gender';
  const ageActive    = filterAgeFrom !== null || activeFilter === 'age';

  return (
    <>
      <View style={styles.filterBar}>
        {prefixSlot}
        <TouchableOpacity
          style={[styles.filterPill, areaActive && styles.filterPillActive]}
          onPress={() => {
            if (activeFilter !== 'area') { onAnyOpen?.(); setActiveFilter('area'); }
            else { setActiveFilter(null); }
          }}
        >
          <Text style={[styles.filterText, areaActive && styles.filterTextActive]}>{areaLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, genderActive && styles.filterPillActive]}
          onPress={() => {
            if (activeFilter !== 'gender') { onAnyOpen?.(); setActiveFilter('gender'); }
            else { setActiveFilter(null); }
          }}
        >
          <Text style={[styles.filterText, genderActive && styles.filterTextActive]}>{genderLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, ageActive && styles.filterPillActive]}
          onPress={() => {
            setTempAgeFrom(filterAgeFrom ?? minAge);
            setTempAgeTo(filterAgeTo ?? maxAge);
            if (activeFilter !== 'age') onAnyOpen?.();
            setActiveFilter('age');
          }}
        >
          <Text style={[styles.filterText, ageActive && styles.filterTextActive]}>{ageLabel}</Text>
        </TouchableOpacity>
        {suffixSlot}
      </View>

      <View style={{ flex: 1 }}>
        {children}

        {activeFilter === 'area' && (
          <View style={styles.dropdownOverlay}>
            <View style={styles.regionGrid}>
              {REGION_ITEMS.map(item => {
                const isSelected = filterArea === (item.id === 0 ? null : item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.regionItem, isSelected && styles.regionItemSelected]}
                    onPress={() => { onAreaChange(item.id === 0 ? null : item.id); setActiveFilter(null); }}
                  >
                    <Text style={[styles.regionItemText, isSelected && styles.regionItemTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {activeFilter === 'gender' && (
          <View style={[styles.dropdownOverlay, styles.genderRow]}>
            {GENDER_ITEMS.map(item => {
              const isSelected = filterGender === item.value;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.genderItem, isSelected && styles.genderItemSelected]}
                  onPress={() => { onGenderChange(item.value); setActiveFilter(null); }}
                >
                  <Text style={[styles.genderItemText, isSelected && styles.genderItemTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {extraDropdown}
      </View>

      <AgeRangeModal
        visible={activeFilter === 'age'}
        tempAgeFrom={tempAgeFrom}
        tempAgeTo={tempAgeTo}
        setTempAgeFrom={setTempAgeFrom}
        setTempAgeTo={setTempAgeTo}
        onConfirm={handleConfirmAge}
        onClose={() => setActiveFilter(null)}
        onReset={() => { onAgeChange(null, null); setActiveFilter(null); }}
        ages={ages}
      />
    </>
  );
});

SearchFilterBarComponent.displayName = 'SearchFilterBar';
const SearchFilterBar = React.memo(SearchFilterBarComponent);
export default SearchFilterBar;
