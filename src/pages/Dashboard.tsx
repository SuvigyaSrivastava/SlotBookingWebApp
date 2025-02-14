import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tab,
  Tabs,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { Edit2, Copy, Trash } from 'lucide-react';
import { getCurrentUser, updateAvailability, getUsers } from '../utils/storage';
import { TimeSlot, User } from '../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState(0);
  const [newSlot, setNewSlot] = useState<TimeSlot>({ start: '09:00 AM', end: '10:00 AM' });
  const [editingSlot, setEditingSlot] = useState<{ index: number; slot: TimeSlot } | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [copyingSlot, setCopyingSlot] = useState<TimeSlot | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load current user and other users whenever the selected date changes
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Ensure availability object exists
      user.availability = user.availability || {};
      setCurrentUser(user);
    }
    const others = getUsers().filter(u => u.username !== user?.username);
    setAllUsers(others.map(u => ({ ...u, availability: u.availability || {} })));
  }, [selectedDate]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) setSelectedDate(newDate);
  };

  // Helper to refresh currentUser from localStorage
  const refreshCurrentUser = () => {
    const updated = getCurrentUser();
    if (updated) setCurrentUser(updated);
  };

  const handleAddSlot = () => {
    if (!currentUser) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const currentSlots = currentUser.availability[dateStr] || [];
    const updatedSlots = [...currentSlots, newSlot];
    updateAvailability(currentUser.username, dateStr, updatedSlots);
    refreshCurrentUser();
    toast.success("Slot added successfully!");
  };

  const handleEditSlot = (index: number, slot: TimeSlot) => {
    setEditingSlot({ index, slot });
  };

  const handleSaveEdit = () => {
    if (!currentUser || !editingSlot) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const currentSlots = currentUser.availability[dateStr] || [];
    const updatedSlots = [...currentSlots];
    updatedSlots[editingSlot.index] = editingSlot.slot;
    updateAvailability(currentUser.username, dateStr, updatedSlots);
    refreshCurrentUser();
    setEditingSlot(null);
    toast.success("Slot updated successfully!");
  };

  const handleDeleteSlot = (index: number) => {
    if (!currentUser) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const currentSlots = currentUser.availability[dateStr] || [];
    const updatedSlots = currentSlots.filter((_, i) => i !== index);
    updateAvailability(currentUser.username, dateStr, updatedSlots);
    refreshCurrentUser();
    toast.success("Slot deleted successfully!");
  };

  const handleCopySlot = (slot: TimeSlot) => {
    setCopyingSlot(slot);
    setCopyDialogOpen(true);
  };

  const handleCopyConfirm = () => {
    if (!currentUser || !copyingSlot) return;
    const updatedAvailability = { ...currentUser.availability };

    selectedDays.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const slots = updatedAvailability[dateStr] || [];
      updatedAvailability[dateStr] = [...slots, copyingSlot];
      updateAvailability(currentUser.username, dateStr, updatedAvailability[dateStr]);
    });

    refreshCurrentUser();
    setCopyDialogOpen(false);
    setCopyingSlot(null);
    setSelectedDays([]);
    toast.success("Slot copied successfully!");
  };

  // --- NEW EXPORT FUNCTIONS ---

  // Export the current user's slots (all dates) as a CSV file.
  
  // Export the current user's slots as a PDF file.
  const exportPDF = () => {
    if (!currentUser) return;
    const doc = new jsPDF();
    const tableColumn = ["Date", "Start Time", "End Time"];
    const tableRows: any[] = [];
    const availability = currentUser.availability;
    for (const date in availability) {
      const slots = availability[date];
      slots.forEach(slot => {
        tableRows.push([date, slot.start, slot.end]);
      });
    }
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("slots.pdf");
    toast.success("PDF exported successfully!");
  };

  // Render slots for a user on the selected date.
  const renderSlots = (user: User) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const slots = user.availability[dateStr] || [];
    return (
      <Box sx={{ mt: 2 }}>
        {slots.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No slots available for this day.
          </Typography>
        ) : (
          slots.map((slot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: 'Cinzel, serif' }}>
                    {format(selectedDate, 'MMM dd, yyyy')} - {slot.start} to {slot.end}
                  </Typography>
                </Box>
                {user.username === currentUser?.username && (
                  <Box>
                    <IconButton onClick={() => handleEditSlot(index, slot)} color="primary">
                      <Edit2 size={20} />
                    </IconButton>
                    <IconButton onClick={() => handleCopySlot(slot)} color="primary">
                      <Copy size={20} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSlot(index)} color="error">
                      <Trash size={20} />
                    </IconButton>
                  </Box>
                )}
              </Paper>
            </motion.div>
          ))
        )}
      </Box>
    );
  };

  if (!currentUser) {
    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 4 }}>
        <Typography variant="h6" color="error">
          No user found. Please log in first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Cinzel, serif' }}>
          Slot Management
        </Typography>
        <Box sx={{ mb: 4 }}>
          <DatePicker label="Select Date" value={selectedDate} onChange={handleDateChange} />
        </Box>

        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="My Availability" />
          <Tab label="Others' Availability" />
        </Tabs>

        {selectedTab === 0 && (
          <>
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Start Time</InputLabel>
                <Select
                  value={newSlot.start}
                  label="Start Time"
                  onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i % 12 || 12;
                    const ampm = i < 12 ? 'AM' : 'PM';
                    return `${hour}:00 ${ampm}`;
                  }).map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>End Time</InputLabel>
                <Select
                  value={newSlot.end}
                  label="End Time"
                  onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i % 12 || 12;
                    const ampm = i < 12 ? 'AM' : 'PM';
                    return `${hour}:00 ${ampm}`;
                  }).map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleAddSlot}>
                Add Slot
              </Button>
            </Box>
            {/* Export Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* <Button variant="outlined" onClick={exportCSV}>
                Export CSV
              </Button> */}
              <Button variant="outlined" onClick={exportPDF}>
                Export PDF
              </Button>
            </Box>
            {renderSlots(currentUser)}
          </>
        )}

        {selectedTab === 1 && (
          <Box>
            {allUsers.map(user => (
              <Box key={user.username} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Cinzel, serif' }}>
                  {user.username}'s Availability
                </Typography>
                {renderSlots(user)}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Edit Slot Dialog */}
      <Dialog open={!!editingSlot} onClose={() => setEditingSlot(null)}>
        <DialogTitle sx={{ fontFamily: 'Cinzel, serif' }}>Edit Slot</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Start Time</InputLabel>
              <Select
                value={editingSlot?.slot.start || ''}
                label="Start Time"
                onChange={(e) =>
                  setEditingSlot(prev =>
                    prev
                      ? { ...prev, slot: { ...prev.slot, start: e.target.value } }
                      : null
                  )
                }
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 || 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  return `${hour}:00 ${ampm}`;
                }).map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>End Time</InputLabel>
              <Select
                value={editingSlot?.slot.end || ''}
                label="End Time"
                onChange={(e) =>
                  setEditingSlot(prev =>
                    prev
                      ? { ...prev, slot: { ...prev.slot, end: e.target.value } }
                      : null
                  )
                }
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 || 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  return `${hour}:00 ${ampm}`;
                }).map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingSlot(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Slot Dialog */}
      <Dialog open={copyDialogOpen} onClose={() => setCopyDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Cinzel, serif' }}>
          Copy Slot to Multiple Days
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select one or more dates to copy this slot:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i + 1)).map(date => (
              <FormControlLabel
                key={format(date, 'yyyy-MM-dd')}
                control={
                  <Checkbox
                    checked={selectedDays.some(
                      d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDays([...selectedDays, date]);
                      } else {
                        setSelectedDays(
                          selectedDays.filter(
                            d => format(d, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd')
                          )
                        );
                      }
                    }}
                  />
                }
                label={format(date, 'MMMM dd, yyyy')}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCopyDialogOpen(false);
              setCopyingSlot(null);
              setSelectedDays([]);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCopyConfirm} variant="contained">
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
