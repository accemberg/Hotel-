"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Download, MessageCircle, ExternalLink, Mail, Phone, Calendar as CalIcon, FileText } from "lucide-react";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import { AdminSelect, AdminTextarea } from "@/components/admin/AdminInputs";

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const snapshot = await getDocs(collection(db, "enquiries"));
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setEnquiries(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } catch (err) {
        setError("Could not load enquiries.");
      } finally {
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Check-In", "Check-Out", "Status", "Notes"];
    const csvData = enquiries.map(e => [
      e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString() : 'N/A',
      `"${e.name || ''}"`, `"${e.email || ''}"`, `"${e.phone || ''}"`,
      e.checkIn || '', e.checkOut || '', e.status || 'New', `"${(e.notes || '').replace(/"/g, '""')}"`
    ].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvData].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "moksh_haveli_enquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateEnquiry = async (id, field, value) => {
    setSavingId(id);
    try {
      await updateDoc(doc(db, "enquiries", id), { [field]: value });
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, [field]: value } : e));
      if (activeLead && activeLead.id === id) {
        setActiveLead({ ...activeLead, [field]: value });
      }
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setSavingId(null);
    }
  };
  
  const openLeadModal = (lead) => {
    setActiveLead(lead);
    setIsManageModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      
      <PageHeader 
        title="Enquiries CRM" 
        subtitle="Manage guest leads, track contact status, and add notes."
        action={
          <AdminButton variant="outline" icon={Download} onClick={exportCSV}>
            Export CSV
          </AdminButton>
        }
      />

      {loading ? (
        <SkeletonLoader type="table" count={10} />
      ) : error ? (
        <EmptyState title="Error Loading CRM" description={error} />
      ) : enquiries.length === 0 ? (
        <EmptyState 
          icon={Mail}
          title="No Enquiries Found" 
          description="You haven't received any guest enquiries yet. When guests fill out the contact form, they will appear here."
        />
      ) : (
        <AdminTable headers={["Date", "Guest", "Contact", "Stay Dates", "Status", "Actions"]}>
          {enquiries.map((enq) => (
            <AdminTableRow key={enq.id}>
              <AdminTableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    {enq.createdAt?.toDate ? enq.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {enq.createdAt?.toDate ? enq.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
              </AdminTableCell>
              
              <AdminTableCell>
                <div className="font-semibold text-slate-900">{enq.name || 'Unknown Guest'}</div>
                {enq.notes && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-medium">
                    <FileText className="w-3 h-3" /> Has Notes
                  </div>
                )}
              </AdminTableCell>
              
              <AdminTableCell>
                <div className="flex flex-col gap-1 text-sm text-slate-600">
                  {enq.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {enq.email}</div>}
                  {enq.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {enq.phone}</div>}
                </div>
              </AdminTableCell>
              
              <AdminTableCell>
                <div className="flex flex-col gap-1 text-sm text-slate-700 font-medium">
                  {enq.checkIn || enq.checkOut ? (
                    <>
                      <span>{enq.checkIn || '?'}</span>
                      <span className="text-slate-400 text-xs">to</span>
                      <span>{enq.checkOut || '?'}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-normal">Not specified</span>
                  )}
                </div>
              </AdminTableCell>
              
              <AdminTableCell>
                <StatusBadge status={enq.status || 'New'} />
              </AdminTableCell>
              
              <AdminTableCell>
                <AdminButton variant="secondary" size="sm" onClick={() => openLeadModal(enq)}>
                  Manage Lead
                </AdminButton>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {/* Manage Lead Modal */}
      <AdminModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage Lead"
        maxWidth="max-w-2xl"
      >
        {activeLead && (
          <div className="flex flex-col gap-6">
            
            {/* Quick Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-wrap gap-6 justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{activeLead.name || 'Unknown'}</h3>
                <p className="text-sm text-slate-500">Rec: {activeLead.createdAt?.toDate ? activeLead.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="flex gap-4">
                {activeLead.phone && (
                  <a 
                    href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-lg font-semibold hover:bg-[#25D366]/20 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                  </a>
                )}
                {activeLead.email && (
                  <a 
                    href={`mailto:${activeLead.email}`} 
                    className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                  >
                    <Mail className="w-5 h-5" /> Email
                  </a>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div>
              <AdminSelect 
                label="Lead Status"
                value={activeLead.status || 'New'}
                onChange={(e) => updateEnquiry(activeLead.id, 'status', e.target.value)}
                options={[
                  { value: 'New', label: 'New Lead' },
                  { value: 'Contacted', label: 'Contacted' },
                  { value: 'Confirmed', label: 'Confirmed' }
                ]}
              />
              {savingId === activeLead.id && <span className="text-xs text-blue-500 mt-1 block">Saving status...</span>}
            </div>

            {/* Notes Section */}
            <div className="border-t border-slate-200 pt-6">
              <AdminTextarea 
                label="Internal Notes"
                placeholder="Add notes about this guest... (Auto-saves on blur)"
                defaultValue={activeLead.notes || ''}
                onBlur={(e) => {
                  if (e.target.value !== activeLead.notes) {
                    updateEnquiry(activeLead.id, 'notes', e.target.value);
                  }
                }}
              />
              <p className="text-xs text-slate-400 mt-1">Notes are only visible to staff. Click outside the box to auto-save.</p>
            </div>
            
          </div>
        )}
      </AdminModal>

    </div>
  );
}
